import React from 'react'
import moment from 'moment'
import { useLanguage } from '~components/contexts/LanguageContext'

export const getUtils = () => {
  const [, t] = useLanguage()
  const setLocalMoment = () => {
    moment.updateLocale('custom', {
      months: [
        t('MONTH1', 'January'),
        t('MONTH2', 'February'),
        t('MONTH3', 'March'),
        t('MONTH4', 'April'),
        t('MONTH5', 'May'),
        t('MONTH6', 'June'),
        t('MONTH7', 'July'),
        t('MONTH8', 'August'),
        t('MONTH9', 'September'),
        t('MONTH10', 'October'),
        t('MONTH11', 'November'),
        t('MONTH12', 'December')
      ],
      monthsShort: [
        t('MONTHSHORT1', 'Jan'),
        t('MONTHSHORT2', 'Feb'),
        t('MONTHSHORT3', 'Mar'),
        t('MONTHSHORT4', 'Apr'),
        t('MONTHSHORT5', 'May'),
        t('MONTHSHORT6', 'Jun'),
        t('MONTHSHORT7', 'Jul'),
        t('MONTHSHORT8', 'Aug'),
        t('MONTHSHORT9', 'Sep'),
        t('MONTHSHORT10', 'Oct'),
        t('MONTHSHORT11', 'Nov'),
        t('MONTHSHORT12', 'Dec')
      ],
      weekdays: [
        t('DAY7', 'Sunday'),
        t('DAY1', 'Monday'),
        t('DAY2', 'Tuesday'),
        t('DAY3', 'Wednesday'),
        t('DAY4', 'Thursday'),
        t('DAY5', 'Friday'),
        t('DAY6', 'Saturday')
      ],
      weekdaysShort: [
        t('DAYSHORT7', 'Sun'),
        t('DAYSHORT1', 'Mon'),
        t('DAYSHORT2', 'Tue'),
        t('DAYSHORT3', 'Wed'),
        t('DAYSHORT4', 'Thu'),
        t('DAYSHORT5', 'Fri'),
        t('DAYSHORT6', 'Sat')
      ],
      weekdaysMin: [
        t('DAYMIN7', 'Su'),
        t('DAYMIN1', 'Mo'),
        t('DAYMIN2', 'Tu'),
        t('DAYMIN3', 'We'),
        t('DAYMIN4', 'Th'),
        t('DAYMIN5', 'Fr'),
        t('DAYMIN6', 'Sa')
      ],
      meridiem: function (hours) {
        return hours < 12 ? t('AM', 'AM') : t('PM', 'PM')
      }
    })
  }

  const lifeSaverIcon = () => {
    return (
      <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_152_9045)">
        <rect x="10" y="6" width="45" height="45" rx="10" fill="white"/>
        </g>
        <g clipPath="url(#clip0_152_9045)">
        <path d="M32.5 43C36.3456 43 40.0338 41.4723 42.753 38.753C45.4723 36.0338 47 32.3456 47 28.5C47 24.6544 45.4723 20.9662 42.753 18.247C40.0338 15.5277 36.3456 14 32.5 14C28.6544 14 24.9662 15.5277 22.247 18.247C19.5277 20.9662 18 24.6544 18 28.5C18 32.3456 19.5277 36.0338 22.247 38.753C24.9662 41.4723 28.6544 43 32.5 43ZM44.1544 33.5243C42.8682 36.4972 40.4972 38.8682 37.5243 40.1544L35.5033 35.1011C37.0964 34.3738 38.3738 33.0964 39.1011 31.5033L44.1544 33.5243ZM27.4757 40.1544C24.5028 38.8682 22.1319 36.4972 20.8456 33.5243L25.8989 31.5033C26.6262 33.0964 27.9036 34.3738 29.4967 35.1011L27.4757 40.1544ZM44.1544 23.4757L39.1011 25.4967C38.3738 23.9036 37.0964 22.6262 35.5033 21.8989L37.5243 16.8456C40.4972 18.1319 42.8682 20.5028 44.1544 23.4757ZM29.4967 21.8989C27.9036 22.6262 26.6262 23.9036 25.8989 25.4967L20.8456 23.4757C22.1319 20.5028 24.5028 18.1319 27.4757 16.8456L29.4967 21.8989ZM32.5 33.9375C31.0579 33.9375 29.6748 33.3646 28.6551 32.3449C27.6354 31.3252 27.0625 29.9421 27.0625 28.5C27.0625 27.0579 27.6354 25.6748 28.6551 24.6551C29.6748 23.6354 31.0579 23.0625 32.5 23.0625C33.9421 23.0625 35.3252 23.6354 36.3449 24.6551C37.3646 25.6748 37.9375 27.0579 37.9375 28.5C37.9375 29.9421 37.3646 31.3252 36.3449 32.3449C35.3252 33.3646 33.9421 33.9375 32.5 33.9375Z" fill="black"/>
        </g>
        <defs>
        <filter id="filter0_d_152_9045" x="0" y="0" width="65" height="65" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="5"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_152_9045"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_152_9045" result="shape"/>
        </filter>
        <clipPath id="clip0_152_9045">
        <rect width="29" height="29" fill="white" transform="translate(18 14)"/>
        </clipPath>
        </defs>
      </svg>
    )
  }

  const phoneIcon = () => {
    return (
      <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_152_9112)">
        <rect x="10" y="6" width="45" height="45" rx="15" fill="white"/>
        </g>
        <g clipPath="url(#clip0_152_9112)">
        <path fillRule="evenodd" clipRule="evenodd" d="M23.0639 16.8302C23.3482 16.5463 23.6896 16.3261 24.0655 16.1841C24.4414 16.0422 24.8432 15.9817 25.2442 16.0067C25.6452 16.0318 26.0364 16.1418 26.3917 16.3294C26.747 16.517 27.0583 16.778 27.3051 17.0951L30.222 20.8424C30.7566 21.5297 30.9451 22.4251 30.7339 23.2701L29.845 26.8289C29.7994 27.0132 29.802 27.2062 29.8527 27.3892C29.9034 27.5722 30.0003 27.7391 30.1343 27.8737L34.1269 31.8664C34.2617 32.0006 34.4288 32.0977 34.6122 32.1484C34.7955 32.1991 34.9888 32.2016 35.1734 32.1556L38.7305 31.2667C39.1476 31.1631 39.5827 31.1553 40.0032 31.244C40.4236 31.3326 40.8186 31.5154 41.1583 31.7786L44.9055 34.6939C46.2526 35.742 46.3761 37.7326 45.1704 38.9367L43.4901 40.617C42.2876 41.8195 40.4904 42.3476 38.815 41.7577C34.5261 40.2507 30.6324 37.7956 27.4238 34.5752C24.2036 31.3671 21.7485 27.4739 20.2413 23.1856C19.653 21.5119 20.1811 19.713 21.3836 18.5105L23.0639 16.8302Z" fill="black"/>
        </g>
        <defs>
        <filter id="filter0_d_152_9112" x="0" y="0" width="65" height="65" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="5"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_152_9112"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_152_9112" result="shape"/>
        </filter>
        <clipPath id="clip0_152_9112">
        <rect width="26" height="26" fill="white" transform="translate(20 16)"/>
        </clipPath>
        </defs>
      </svg>
    )
  }

  const chatIcon = () => {
    return (
      <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_152_9116)">
        <rect x="10" y="6" width="45" height="45" rx="15" fill="white"/>
        </g>
        <path d="M32.5 40.3125C39.9554 40.3125 46 35.0239 46 28.5C46 21.9761 39.9554 16.6875 32.5 16.6875C25.0446 16.6875 19 21.9761 19 28.5C19 31.47 20.2538 34.1869 22.3244 36.2625C22.1607 37.977 21.6207 39.8569 21.0233 41.2676C20.89 41.5815 21.1482 41.9325 21.484 41.8785C25.291 41.2541 27.5539 40.2956 28.5378 39.7961C29.83 40.142 31.1623 40.3156 32.5 40.3125Z" fill="black"/>
        <defs>
        <filter id="filter0_d_152_9116" x="0" y="0" width="65" height="65" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="5"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_152_9116"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_152_9116" result="shape"/>
        </filter>
        </defs>
      </svg>
    )
  }

  return {
    setLocalMoment,
    lifeSaverIcon,
    phoneIcon,
    chatIcon
  }
}
