import { StyleSheet } from 'react-native';

export const mainStyles = StyleSheet.create({
  main_view_container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  empty_state_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    flex: 1,
  },

  flex_row: {
    flexDirection: 'row',
  },

  input_text: {
    marginHorizontal: 12,
    height: 42,
  },

  check_box_row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    alignSelf: 'flex-end',
    marginHorizontal: 12,
  },

  checkBox: {
    marginHorizontal: 12,
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },

  button_disabled: {
    opacity: 0.2,
  },

  section_title: {
    flex: 1,
  },

  subtitle: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },

  section_title_row: {
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 8,
    flexDirection: 'row',
  },

  sub_section_margin: {
    marginTop: 16,
  },

  data_field_label: {
    flex: 1,
    color: 'black',
  },

  data_field_value: {
    flex: 1,
    textAlign: 'right',
  },

  divider: {
    height: 0.5,
    backgroundColor: 'black',
  },

  divider_margin: {
    height: 0.5,
    backgroundColor: 'black',
    marginLeft: 42,
  },

  vertical_divider: {
    width: 0.5,
    backgroundColor: 'black',
  },

  data_field_divider: {
    height: 0.5,
    backgroundColor: 'black',
    marginLeft: 12,
  },

  switch: {
    alignItems: 'flex-end',
  },

  badge: {
    marginRight: 16,
  },
});
