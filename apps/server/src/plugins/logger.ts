// import { pino } from 'pino'

// const NODE_ENV = 'development'
// let targets = [
//     {
//         target: 'pino/file',
//         options: {
//             destination: `${process.cwd()}/log/index.log`
//         },
//         level: 'info'
//     },
//     {
//         target: 'pino/file',
//         options: {
//             destination: `${process.cwd()}/log/error.log`
//         },
//         level: 'error'
//     },
//     {
//         target: 'pino/file',
//         options: {
//             destination: `${process.cwd()}/log/warn.log`
//         },
//         level: 'warn'
//     }
// ]
// if (NODE_ENV === 'development') {
//     targets.push({
//         target: 'pino/file',
//         level: 'info',
//         options: {
//             destination: ''
//         }
//     })
// }
// export default pino({
//     transport: {
//         targets
//     },
//     formatters: {
//         bindings: () => {
//             return {}
//         }
//     },
//     timestamp: () =>
//         `,"timestamp":"${new Date(Date.now()).toLocaleString('zh-CN')}"`
// })
export default {}
