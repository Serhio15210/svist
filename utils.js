import React from "react";
import PolandIcon from './src/assets/poland.svg'
import EnglandIcon from './src/assets/england.svg'
import UkraineIcon from './src/assets/ukraine.svg'
import USAIcon from './src/assets/usa.svg'
import {mainStyles} from "./src/styles/mainStyles";


export const getWeightFromPercents = (percents, weight) => {
  if (!percents || !weight) return ''
  return `${(weight / 100 * percents).toFixed(1)}`
}

export const getPercentsFromWeight = (weight, fullWeight) => {
  if (!weight || !fullWeight) return ''
  return `${(weight / (fullWeight / 100)).toFixed(1)}`
}

export const getTotalCount = (values, field) => {
  let percents = 0
  for (let i = 0; i < values.phases.length; i++) {
    for (let j = 0; j < values.phases[i].items.length; j++) {
      // console.log(values.phases[i].items[j].date)
      percents += +(values[`phase${i + 1}percent${values.phases[i].items[j].date}`]?.length > 0 ? values[`phase${i + 1}${field}${values.phases[i].items[j].date}`] : 0)
    }
  }
  return percents.toFixed(1)
}

export const getStringDate = (date) => {
  let day = date.getUTCDate()
  let month = date.getUTCMonth() + 1
  let year = date.getFullYear()
  return `${year}-${month}-${day}`
}

export const districts = ['Bielany', 'Bemowo', 'Bialoleka', 'Ochota']
export const cities = ['Варшава', 'Вроцлав', 'Конин', 'Лодзь', 'Киев']
export const countries = ['Польша', 'Украина', 'Франция', 'Испания', 'Португалия', 'Чехия']
export const langs = ['PL', 'UA', 'EN', 'RU', 'BY']
export const times = ['8:00', '8:15', '8:30', '8:45', '9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00',
  '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45',
  '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45',
  '21:00', '21:15', '21:30', '21:45', '22:00']
export const formats = ['5х5', '6х6', '7х7', '8х8', '9х9', '10x10', '11x11']
export const format5x5 = ['5х5', '5х5+2 замены', '5х5+4 замены', '5х5х5 по кругу', '5х5х5х5 мини-турнир']
export const format6x6 = ['6х6', '6х6+2 замены', '6х6+4 замены', '6х6х6 по кругу', '6х6х6х6 мини-турнир']
export const format7x7 = ['7х7', '7х7+2 замены', '7х7+4 замены', '7х7х7 по кругу', '7х7х7х7 мини-турнир']
export const format8x8 = ['8х8', '8х8+2 замены', '8х8+4 замены', '8х8х8 по кругу', '8х8х8х8 мини-турнир']
export const format9x9 = ['9х9', '9х9+2 замены', '9х9+4 замены', '9х9х9 по кругу', '9х9х9х9 мини-турнир']
export const format10x10 = ['10х10', '10х10+2 замены', '10х10+4 замены', '10х10х10 по кругу', '10х10х10х10 мини-турнир']
export const format11x11 = ['11х11 + замены', '11х11х11х11 мини-турнинр']
export const matchLengths = [45, 60, 90, 120]
export const coatings = ['Твёрдый пол', 'Искусственная трава', 'Натуральная трава', 'Резиновое покрытие']
export const coverings = ['Под крышей', 'На улице', 'Баллон']

export const getFormatItems = (format) => {
  switch (format) {
    case '5х5': return format5x5
    case '6х6': return format6x6
    case '7х7': return format7x7
    case '8х8': return format8x8
    case '9х9': return format9x9
    case '10x10': return format10x10
    case '11x11': return format11x11
    default: return []
  }
}
export const getFieldInfo = (field) => {
  switch (field) {
    case 'freePlaces': return {
      title: 'Введите количество свободных мест',
      placeholder: 'Введите количество'
    }
    case 'price': return {
      title: 'Введите стоимость участия для одного игрока',
      placeholder: 'Введите сумму'
    }
    default: return {
      title: '',
      placeholder: ''
    }
  }
}


export const countriesWithIcons = [
  {
    id: 1,
    name: 'Англия',
    icon: <EnglandIcon style={mainStyles.countryIcon} />
  },
  {
    id: 2,
    name: 'Польша',
    icon: <PolandIcon style={mainStyles.countryIcon} />
  },
  {
    id: 3,
    name: 'США',
    icon: <USAIcon style={mainStyles.countryIcon} />
  },
  {
    id: 4,
    name: 'Украина',
    icon: <UkraineIcon style={mainStyles.countryIcon} />
  },
  {
    id: 5,
    name: 'Англия',
    icon: <EnglandIcon style={mainStyles.countryIcon} />
  },
  {
    id: 6,
    name: 'Польша',
    icon: <PolandIcon style={mainStyles.countryIcon} />
  },
  {
    id: 7,
    name: 'США',
    icon: <USAIcon style={mainStyles.countryIcon} />
  },
  {
    id: 8,
    name: 'Украина',
    icon: <UkraineIcon style={mainStyles.countryIcon} />
  }
]