import visaLogo from './payment/visa.svg'
import mastercardLogo from './payment/mastercard.svg'
import mtnMomoLogo from './payment/mtn-momo.png'
import telecelCashLogo from './payment/telecel-cash.jpg'
import atMoneyLogo from './payment/at-money.png'

export const paymentMethods = [
  { name: 'Visa', logo: visaLogo, className: 'h-6 sm:h-7' },
  { name: 'Mastercard', logo: mastercardLogo, className: 'h-8 sm:h-9' },
  { name: 'MTN MoMo', logo: mtnMomoLogo, className: 'h-8 sm:h-9' },
  { name: 'Telecel Cash', logo: telecelCashLogo, className: 'h-8 sm:h-9' },
  { name: 'AT Money', logo: atMoneyLogo, className: 'h-8 sm:h-9' },
]
