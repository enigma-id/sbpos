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
      try {
        const device = selectedDevice || (await scanDevices());
        if (!device) return;

        const payload =
          `<img>data:image/png;base64,${base64logo}</img>\n\n` +
          `${padLine(
            dateFormat(data?.ordered_at, 'DD-MM-YYYY'),
            dateFormat(data?.ordered_at, 'HH:mm'),
          )}\n` +
          `${padLine('Transaksi', `No. ${data?.code || '-'}`)}\n` +
          `${padLine('Sales Channel', `${data?.channel?.name || '-'}`)}\n` +
          `${padLine('Kasir', data?.session?.cashier?.name)}\n` +
          '--------------------------------\n' +
          '<b>Deskripsi</b>                  <b>Total</b>\n' +
          '--------------------------------\n' +
          data?.items
            ?.map(item => {
              const itemLine =
                `${item?.catalog?.name}\n` +
                `${padLine(
                  `@${currencyFormat(item?.unit_nett, false)} x ${
                    item?.quantity
                  }`,
                  currencyFormat(item?.unit_nett * item?.quantity, false),
                )}\n`;

              const additionals =
                item?.additionals?.length > 0
                  ? item.additionals
                      .map(
                        addition =>
                          `   ${addition?.catalog?.name}\n` +
                          `${padLine(
                            `   @${currencyFormat(
                              addition?.unit_nett,
                              false,
                            )} x ${addition?.quantity}`,
                            currencyFormat(
                              addition?.unit_nett * addition?.quantity,
                              false,
                            ),
                          )}\n`,
                      )
                      .join('')
                  : '';

              return itemLine + additionals;
            })
            .join('') +
          `--------------------------------\n` +
          `${padLine('TOTAL', currencyFormat(data?.total_charges, false))}\n` +
          `${padLine(
            data?.payment_method?.name || 'CASH',
            currencyFormat(data?.total_payment, false),
          )}\n` +
          (data?.payment_ref !== ''
            ? `${padLine('REF', data?.payment_ref)}\n`
            : '') +
          (data?.total_payment - data?.total_charges > 0
            ? `${padLine(
                'KEMBALIAN',
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

      try {
        const device = selectedDevice || (await scanDevices());
        if (!device) return;

        const payload =
          `${centerText('<b># LAPORAN KASIR #</b>')}\n` +
          `${padLine('Kasir', summary?.cashier?.name)}\n` +
          `${padLine(
            'Mulai Sesi',
            dateFormat(summary?.started_at, 'DD-MM-YYYY HH:mm'),
          )}\n` +
          `${padLine(
            'Akhir Sesi',
            dateFormat(new Date(), 'DD-MM-YYYY HH:mm'),
          )}\n` +
          `${padLine(
            'Item Terjual',
            currencyFormat(summary?.total_cup, false),
          )}\n` +
          (summary?.catalog_solds && summary?.catalog_solds !== null
            ? `--------------------------------\n` +
              `${centerText('<b>## ITEM TERJUAL ##</b>')}\n` +
              `--------------------------------\n` +
              summary?.catalog_solds
                ?.map(
                  s =>
                    `${padLine(
                      s?.catalog_name + ' ' + '(' + `${s?.quantity}` + ')',
                      currencyFormat(s?.subtotal),
                    )}\n`,
                )
                .join('')
            : '') +
          (summary?.sales_channels && summary?.sales_channels !== null
            ? `--------------------------------\n` +
              `${centerText('<b>## RINGKASAN ORDER ##</b>')}\n` +
              `--------------------------------\n` +
              summary?.sales_channels
                ?.map(
                  s =>
                    `${padLine(
                      s?.channel_name +
                        ' ' +
                        '(' +
                        `${s?.transaction_count}` +
                        ')',
                      currencyFormat(s?.subtotal),
                    )}\n`,
                )
                .join('')
            : '') +
          (summary?.cash_payments && summary?.cash_payments !== null
            ? `--------------------------------\n` +
              `${centerText('<b>## RINGKASAN PEMBAYARAN ##</b>')}\n` +
              `--------------------------------\n` +
              summary?.cash_payments
                ?.map(
                  s =>
                    `${padLine(
                      s?.payment_name ? s?.payment_name : 'TUNAI',
                      currencyFormat(s?.subtotal),
                    )}\n`,
                )
                .join('')
            : '') +
          `--------------------------------\n` +
          `${centerText('<b>## MANAJEMEN KAS ##</b>')}\n` +
          `--------------------------------\n` +
          `${padLine('Kas Awal', currencyFormat(summary?.cash_started))}\n` +
          `${padLine(
            'Transaksi Tunai',
            currencyFormat(summary?.cash_due - summary?.cash_started),
          )}\n` +
          `${padLine('Kas Seharusnya', currencyFormat(summary?.cash_due))}\n` +
          `${padLine('Kas Akhir', currencyFormat(cash))}\n` +
          `${padLine('Selisih', currencyFormat(cash - summary?.cash_due))}\n`;
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
