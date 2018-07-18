import moment from 'moment'

export default timestamp => moment().diff(moment(timestamp), 'days')
