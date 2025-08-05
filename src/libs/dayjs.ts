import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(utc);
dayjs.extend(timezone);

// Define o timezone padrão (opcional)
dayjs.tz.setDefault("America/Sao_Paulo")
dayjs.locale("pt-br")

export { dayjs }