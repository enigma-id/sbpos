// hooks/usePrint.js
import { useCallback, useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import ThermalPrinterModule from 'react-native-thermal-printer';
import { BleManager, State } from 'react-native-ble-plx';

import { base64logo } from './base64logo';
import { currencyFormat, dateFormat } from './common';

const bleManager = new BleManager();

async function requestBluetoothPermissions() {
  if (Platform.OS !== 'android') return true;
  try {
    const permissions =
      Platform.Version >= 31
        ? [
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]
        : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

    const granted = await PermissionsAndroid.requestMultiple(permissions);
    return Object.values(granted).every(
      status => status === PermissionsAndroid.RESULTS.GRANTED,
    );
  } catch (err) {
    return false;
  }
}

function padLine(left = '', right = '', width = 32) {
  const space = width - left.length - right.length;
  return left + ' '.repeat(space > 0 ? space : 1) + right;
}

function centerText(text, width = 32) {
  return text
    .split('\n')
    .map(line => {
      const strippedLine = line.replace(/<\/?[^>]+(>|$)/g, '');
      const space = Math.floor((width - strippedLine.length) / 2);
      return ' '.repeat(space > 0 ? space : 0) + line;
    })
    .join('\n');
}

export function usePrint() {
  const [devices, setDevices] = useState([]);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  const ensureBluetooth = useCallback(async () => {
    const permissionsGranted = await requestBluetoothPermissions();
    if (!permissionsGranted) throw new Error('Bluetooth permission denied');

    const state = await bleManager.state();
    if (state === State.PoweredOn) return;

    await bleManager.enable();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        sub?.remove();
        reject(new Error('Bluetooth tidak aktif setelah timeout'));
      }, 8000);

      const sub = bleManager.onStateChange(newState => {
        if (newState === State.PoweredOn) {
          clearTimeout(timeout);
          sub.remove();
          resolve();
        }
      }, true);
    });
  }, []);

  const scanDevices = useCallback(async () => {
    await ensureBluetooth();
    const list = await ThermalPrinterModule.getBluetoothDeviceList();
    if (!list?.length) throw new Error('No printer found');

    if (list.length === 1) {
      return list[0];
    } else {
      setDevices(list);
      setShowDeviceModal(true);
      return null; // tunggu user pilih dari modal
    }
  }, [ensureBluetooth]);

  const doPrint = useCallback(async (device, payload) => {
    if (!device) return;
    await ThermalPrinterModule.printBluetooth({
      payload,
      macAddress: device.macAddress || device.address,
      mmFeedPaper: 10,
      printerNbrCharactersPerLine: 30,
    });
  }, []);

  const printReceipt = useCallback(
    async (data, selectedDevice = null) => {
      const groupedCategories = items => {
        const group = {};

        items.forEach(item => {
          const category = item?.catalog?.category;
          const discount = item?.discount_value * item?.quantity || 0;

          if (!category) return;

          const id = category.id;
          const name = category.name;

          if (!group[id]) {
            group[id] = {
              id,
              name,
              subtotal: 0,
            };
          }

          group[id].subtotal += discount;
        });

        const result = Object.values(group).filter(item => item.subtotal > 0);
        return result;
      };

      const categoryDiscounts = groupedCategories(data?.items);

      try {
        const device = selectedDevice || (await scanDevices());
        if (!device) return;

        const payload =
          `<img>data:image/png;base64,${base64logo}</img>\n` +
          `${padLine(
            dateFormat(data?.ordered_at, 'DD-MM-YYYY'),
            dateFormat(data?.ordered_at, 'HH:mm'),
          )}\n` +
          `${padLine('Transaction', `No. ${data?.code || '-'}`)}\n` +
          `${padLine('Sales Channel', `${data?.channel?.name || '-'}`)}\n` +
          `${padLine('Cashier', data?.session?.cashier?.name)}\n` +
          (data?.note ? `${padLine('Bill Name', data?.note)}\n` : '') +
          (data?.membership
            ? `${padLine('Member', data?.membership?.name)}\n`
            : '') +
          (data?.ticket ? `${padLine('Bill Name', data?.ticket)}\n` : '') +
          '--------------------------------\n' +
          '<b>Description</b>                <b>Total</b>\n' +
          '--------------------------------\n' +
          data?.items
            ?.map(item => {
              const itemLine =
                `${item?.catalog?.name || item?.description}\n` +
                `${padLine(
                  `${item?.quantity} x ${currencyFormat(
                    item?.unit_nett,
                    false,
                  )}`,
                  currencyFormat(item?.unit_nett * item?.quantity, false),
                )}\n`;

              const additionals =
                item?.additionals?.length > 0
                  ? item.additionals
                      .map(
                        addition =>
                          `+ ${addition?.catalog?.name}\n` +
                          (addition?.addon?.type !== 'options'
                            ? `${padLine(
                                `${addition?.quantity} x ${currencyFormat(
                                  addition?.unit_nett,
                                  false,
                                )}`,
                                currencyFormat(
                                  addition?.quantity > 0
                                    ? addition?.quantity * addition?.unit_nett
                                    : item?.quantity * addition?.unit_nett,
                                  false,
                                ),
                              )}\n`
                            : ''),
                      )
                      .join('')
                  : '';

              return itemLine + additionals;
            })
            .join('') +
          `--------------------------------\n` +
          (data?.subtotal_nett > data?.total_charges
            ? `${padLine(
                'Before Discount',
                currencyFormat(data?.subtotal_nett, false),
              )}\n`
            : '') +
          (categoryDiscounts?.length > 0
            ? categoryDiscounts?.map(
                d =>
                  `${padLine(
                    `Discount ${d?.name}`,
                    `-${currencyFormat(d?.subtotal, false)}`,
                  )}\n`,
              )
            : '') +
          (data?.discount_value > 0
            ? `${padLine(
                'Discount Order',
                `-${currencyFormat(data?.discount_value, false)}`,
              )}\n`
            : '') +
          `--------------------------------\n` +
          `${padLine('Total', currencyFormat(data?.total_charges, false))}\n` +
          `${padLine(
            data?.payment_method?.name || 'Cash',
            currencyFormat(data?.total_payment, false),
          )}\n` +
          (data?.payment_ref !== ''
            ? `${padLine('Ref', data?.payment_ref)}\n`
            : '') +
          (data?.total_payment - data?.total_charges > 0
            ? `${padLine(
                'Change',
                currencyFormat(
                  data?.total_payment - data?.total_charges,
                  false,
                ),
              )}\n`
            : '');

        await doPrint(device, payload);
      } catch (err) {
        Alert.alert('Gagal print struk', err.message || 'Unknown error');
      }
    },
    [scanDevices, doPrint],
  );

  const printSummary = useCallback(
    async (data, selectedDevice = null) => {
      let summary = data?.summary;
      let cash = data?.cash;

      const formatFinishedAt = dateString => {
        const date = new Date(dateString);
        const year = date.getFullYear();

        // Jika tahun adalah 1 (karena 0001 dianggap 1)
        if (year === 1) {
          return dateFormat(new Date(), 'DD-MM-YYYY HH:mm');
        }

        return dateFormat(date, 'DD-MM-YYYY HH:mm');
      };

      try {
        const device = selectedDevice || (await scanDevices());
        if (!device) return;

        const payload =
          '--------------------------------\n' +
          `${centerText('<b># CASHIER REPORT #</b>')}\n` +
          '--------------------------------\n' +
          `${padLine('Cashier', summary?.cashier?.name)}\n` +
          `${padLine(
            'Start Session',
            dateFormat(summary?.started_at, 'DD-MM-YYYY HH:mm'),
          )}\n` +
          `${padLine(
            'End Session',
            formatFinishedAt(summary?.finished_at),
          )}\n` +
          '--------------------------------\n' +
          `${centerText('<b>## CASHFLOW SUMMARY ##</b>')}\n` +
          '--------------------------------\n' +
          `${padLine(
            'Starting Cash',
            currencyFormat(summary?.cash_started, false),
          )}\n` +
          `${padLine('Ending Cash', currencyFormat(cash, false))}\n` +
          `${padLine(
            'Expected Cash',
            currencyFormat(summary?.cash_due, false),
          )}\n` +
          `${padLine(
            'Topup Cash',
            currencyFormat(summary?.cash_topup, false),
          )}\n` +
          `${padLine(
            'Total Bill Payments',
            currencyFormat(summary?.bill_payment, false),
          )}\n` +
          `${padLine(
            'Total Sales',
            currencyFormat(summary?.summary_order?.total_nett, false),
          )}\n` +
          `${padLine(
            'Total Discount',
            currencyFormat(summary?.summary_order?.total_discount, false),
          )}\n` +
          `${padLine(
            'After Discount',
            currencyFormat(summary?.summary_order?.total_charges, false),
          )}\n` +
          `${padLine(
            'Total Bill',
            currencyFormat(summary?.summary_order?.total_openbill, false),
          )}\n` +
          `${padLine(
            'Total Omzet',
            currencyFormat(
              summary?.summary_order?.total_openbill +
                summary?.summary_order?.total_nett,
              false,
            ),
          )}\n` +
          (summary?.cash_payments && summary?.cash_payments !== null
            ? `--------------------------------\n` +
              `${centerText('<b>## PAYMENTS ##</b>')}\n` +
              `--------------------------------\n` +
              summary?.cash_payments
                ?.map(
                  s =>
                    `${padLine(
                      s?.payment_name ? s?.payment_name : 'Cash',
                      currencyFormat(s?.subtotal, false),
                    )}\n`,
                )
                .join('')
            : '') +
          (summary?.category_solds && summary?.category_solds !== null
            ? `--------------------------------\n` +
              `${centerText('<b>## CATEGORY SOLD ##</b>')}\n` +
              `--------------------------------\n` +
              summary?.category_solds
                ?.map(
                  s =>
                    `${padLine(
                      s?.name + ' ' + '(' + `${s?.quantity}` + ')',
                      currencyFormat(s?.total_charges, false),
                    )}\n`,
                )
                .join('')
            : '');
        await doPrint(device, payload);
        return true;
      } catch (err) {
        Alert.alert('Gagal print ringkasan', err.message || 'Unknown error');
      }
    },
    [scanDevices, doPrint],
  );

  return {
    printReceipt,
    printSummary,
    devices,
    showDeviceModal,
    setShowDeviceModal,
  };
}
