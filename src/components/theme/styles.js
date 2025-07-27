import { Dimensions, StyleSheet } from 'react-native';
import Colors from './colors';

export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;

export const Styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
  },
  content: {
    width: DEVICE_WIDTH,
    flex: 1,
  },
  // btn variant
  btnPrimary: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  btnOutlinePrimary: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },

  btnSecondary: {
    backgroundColor: Colors.SECONDARY,
  },
  btnOutlineSecondary: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.SECONDARY,
  },

  btnDanger: {
    backgroundColor: Colors.DANGER,
  },
  btnOutlineDanger: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.DANGER,
  },

  btnSuccess: {
    backgroundColor: Colors.SUCCESS,
  },
  btnOutlineSuccess: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.SUCCESS,
  },

  btnWarning: {
    backgroundColor: Colors.WARNING,
  },
  btnOutlineWarning: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.WARNING,
  },

  btnDisabled: {
    backgroundColor: Colors.SECONDARY_TRSP,
  },

  //   font color
  textPrimary: {
    color: Colors.PRIMARY,
  },
  textSecondary: {
    color: Colors.SECONDARY,
  },
  textWhite: {
    color: Colors.WHITE,
  },
  textDanger: {
    color: Colors.DANGER,
  },
  textSuccess: {
    color: Colors.SUCCESS,
  },
  textWarning: {
    color: Colors.WARNING,
  },
  textGrey: {
    color: Colors.GREY,
  },

  //   font size
  fs1: {
    fontSize: 25,
  },
  fs2: {
    fontSize: 20,
  },
  fs3: {
    fontSize: 16,
  },
  fs4: {
    fontSize: 14,
  },
  fs5: {
    fontSize: 12,
  },

  //   text align
  textCenter: {
    textAlign: 'center',
  },
  textStart: {
    textAlign: 'left',
  },
  textEnd: {
    textAlign: 'right',
  },

  //   text transform
  textUppercase: {
    textTransform: 'uppercase',
  },
  textCapitalize: {
    textTransform: 'capitalize',
  },
  textLowercase: {
    textTransform: 'lowercase',
  },

  //   padding
  py1: {
    paddingVertical: 4,
  },
  py2: {
    paddingVertical: 6,
  },
  py3: {
    paddingVertical: 8,
  },
  py4: {
    paddingVertical: 10,
  },
  py5: {
    paddingVertical: 15,
  },

  px1: {
    paddingHorizontal: 4,
  },
  px2: {
    paddingHorizontal: 6,
  },
  px3: {
    paddingHorizontal: 8,
  },
  px4: {
    paddingHorizontal: 10,
  },
  px5: {
    paddingHorizontal: 15,
  },
  px6: {
    paddingHorizontal: 20,
  },

  pb1: {
    paddingBottom: 4,
  },
  pb2: {
    paddingBottom: 6,
  },
  pb3: {
    paddingBottom: 8,
  },
  pb4: {
    paddingBottom: 10,
  },

  pt1: {
    paddingTop: 4,
  },
  pt2: {
    paddingTop: 6,
  },
  pt3: {
    paddingTop: 8,
  },
  pt4: {
    paddingTop: 10,
  },

  ps1: {
    paddingStart: 4,
  },
  ps2: {
    paddingStart: 6,
  },
  ps3: {
    paddingStart: 8,
  },
  ps4: {
    paddingStart: 10,
  },
  ps5: {
    paddingStart: 15,
  },

  pe1: {
    paddingEnd: 4,
  },
  pe2: {
    paddingEnd: 6,
  },
  pe3: {
    paddingEnd: 8,
  },
  pe4: {
    paddingEnd: 10,
  },

  //   margin
  m1: {
    margin: 4,
  },
  m2: {
    margin: 6,
  },
  m3: {
    margin: 8,
  },
  m4: {
    margin: 10,
  },
  m5: {
    margin: 15,
  },

  my1: {
    marginVertical: 4,
  },
  my2: {
    marginVertical: 6,
  },
  my3: {
    marginVertical: 8,
  },
  my4: {
    marginVertical: 10,
  },

  mx1: {
    marginHorizontal: 4,
  },
  mx2: {
    marginHorizontal: 6,
  },
  mx3: {
    marginHorizontal: 8,
  },
  mx4: {
    marginHorizontal: 10,
  },

  mb1: {
    marginBottom: 4,
  },
  mb2: {
    marginBottom: 6,
  },
  mb3: {
    marginBottom: 8,
  },
  mb4: {
    marginBottom: 10,
  },
  mb5: {
    marginBottom: 15,
  },

  mt1: {
    marginTop: 4,
  },
  mt2: {
    marginTop: 6,
  },
  mt3: {
    marginTop: 8,
  },
  mt4: {
    marginTop: 10,
  },
  mt5: {
    marginTop: 15,
  },

  ms1: {
    marginStart: 4,
  },
  ms2: {
    marginStart: 6,
  },
  ms3: {
    marginStart: 8,
  },
  ms4: {
    marginStart: 10,
  },
  ms5: {
    marginStart: 15,
  },

  me1: {
    marginEnd: 4,
  },
  me2: {
    marginEnd: 6,
  },
  me3: {
    marginEnd: 8,
  },
  me4: {
    marginEnd: 10,
  },
  me5: {
    marginEnd: 15,
  },

  //   hr text
  hrContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  hrContent: {
    position: 'absolute',
    backgroundColor: '#f0f2f7',
    zIndex: 9,
  },

  // display
  flex: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },

  // justify-content
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentBetween: {
    justifyContent: 'space-between',
  },
  justifyContentEnd: {
    justifyContent: 'flex-end',
  },
  justifyContentStart: {
    justifyContent: 'flex-start',
  },
  justifyContentAround: {
    justifyContent: 'space-around',
  },

  // align-items
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignItemsStart: {
    alignItems: 'flex-start',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },

  // align-content
  alignContentCenter: {
    alignContent: 'center',
  },
  alignContentEnd: {
    alignContent: 'flex-end',
  },

  // background
  bgWhite: {
    backgroundColor: Colors.WHITE,
  },
  bgPrimary: {
    backgroundColor: Colors.PRIMARY,
  },
  bgSecondary: {
    backgroundColor: Colors.SECONDARY,
  },
  bgLight: {
    backgroundColor: Colors.SECONDARY_TRSP,
  },
  bgNotification: {
    backgroundColor: Colors.PRIMARY_TRSP,
  },
  bgDanger: {
    backgroundColor: Colors.DANGER,
  },
  bgSuccess: {
    backgroundColor: Colors.SUCCESS,
  },

  // border-radius
  rounded1: {
    borderRadius: 5,
  },
  rounded2: {
    borderRadius: 10,
  },
  rounded3: {
    borderRadius: 15,
  },
  rounded4: {
    borderRadius: 20,
  },

  // select
  selectContainer: {
    paddingHorizontal: 10,
  },
  dropdownStyle: {
    borderRadius: 5,
  },
  searchBox: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    height: 40,
    borderTopLeftRadius: 10,
    borderTopRightRadiusRadius: 10,
    color: Colors.BLACK,
    fontFamily: 'Ubuntu-Regular',
    fontSize: 13,
  },

  // utils
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    maxHeight: 130,
    maxWidth: 130,
  },
  iconButton: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    backgroundColor: '#C4C4C4',
    zIndex: 2,
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.BACKGROUND,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 3,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  card: {
    width: DEVICE_WIDTH / 2.5,
    height: DEVICE_WIDTH / 3,
    borderRadius: 5,
    margin: 5,
    marginBottom: 10,
  },
  cardIcon: {
    height: 45,
    width: 45,
    alignSelf: 'center',
    marginBottom: 10,
  },
  cartTitle: {
    fontSize: 12,
    color: Colors.SECONDARY,
    textAlign: 'center',
  },
  listTitle: {
    color: Colors.SECONDARY,
    fontFamily: 'Ubuntu-SemiBold',
    fontSize: 12,
  },
  inputTitle: {
    fontFamily: 'Ubuntu-SemiBold',
    fontSize: 12,
  },

  // border
  border: {
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },

  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },

  // position
  relative: {
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
  },
});
