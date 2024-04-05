import {PieChart} from 'react-native-gifted-charts';

const Category = () => {
  const pieData = [
    {value: 54, color: '#177AD5'},
    {value: 40, color: '#79D2DE'},
    {value: 20, color: '#ED6665'},
  ];

  return (
    <PieChart
      data={pieData}
      showText
      textColor="black"
      radius={150}
      textSize={20}
      focusOnPress
      showValuesAsLabels
      showTextBackground
      textBackgroundRadius={26}
    />
  );
};

export default Category;
