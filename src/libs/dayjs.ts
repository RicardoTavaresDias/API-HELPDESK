import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.locale("pt-br")

export { dayjs }