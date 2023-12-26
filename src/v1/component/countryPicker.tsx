import React, {useState} from 'react';
import {View} from 'react-native';

import CountryPicker from 'react-native-country-picker-modal';
import {Country, CountryCode, OnlyCode} from '../utils/country';

const addplus = '+';
const CountryCodePicker = props => {
  //country code
  const dial_code = props.dial_code ? OnlyCode(props.dial_code) : 'BD';

  const [countryCode, setCountryCode] = useState<CountryCode>(dial_code);
  const [code, setCode] = useState<string>('+880');
  const [country, setCountry] = useState<Country | any>(null);
  const [withCountryNameButton, setWithCountryNameButton] =
    useState<boolean>(false);
  const [withFlag, setWithFlag] = useState<boolean>(true);
  const [withEmoji, setWithEmoji] = useState<boolean>(true);
  const [withFilter, setWithFilter] = useState<boolean>(true);
  const [withAlphaFilter, setWithAlphaFilter] = useState<boolean>(false);
  const [withCallingCode, setWithCallingCode] = useState<boolean>(true);

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCountry(country);
    props.SetCountryCode(addplus + country.callingCode[0]);
  };

  return (
    <View>
      <CountryPicker
        {...{
          countryCode,
          withFilter,
          withFlag,
          withCountryNameButton,
          withAlphaFilter,
          withCallingCode,
          withEmoji,
          onSelect,
        }}
      />
    </View>
  );
};

export default CountryCodePicker;
