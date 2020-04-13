import React from "react";
import T from 'i18n-react';
import {connect} from "react-redux";
import {compose, withHandlers} from "recompose";

import Tooltip from "@material-ui/core/Tooltip";
import MenuItem from "@material-ui/core/MenuItem";

import IconVolumeOn from '@material-ui/icons/VolumeUp';
import IconVolumeOff from '@material-ui/icons/VolumeOff';

import {appChangeSound} from "../../actions/app";

export const SettingVolumeMenuItemBody = ({sound, toggleVolume, showText}) =>
  <Tooltip title={`${T.translate('App.Settings.Sound')} ${T.translate(`App.Misc.$${sound ? 'on' : 'off'}`)}`}>
    <MenuItem onClick={toggleVolume}>
      {sound ? <IconVolumeOn /> : <IconVolumeOff />}
      <span style={{paddingLeft: '12px'}}>{showText && T.translate('App.Settings.Sound')}</span>&nbsp;
    </MenuItem>
  </Tooltip>;

export const withSettingVolume = compose(
  connect((state) => ({
      sound: state.getIn(['app', 'sound'])
    })
    , {appChangeSound}
  )
  , withHandlers({
    toggleVolume: ({sound, appChangeSound}) => e => appChangeSound(!sound)
  })
);


export const SettingVolumeMenuItem = withSettingVolume(SettingVolumeMenuItemBody);