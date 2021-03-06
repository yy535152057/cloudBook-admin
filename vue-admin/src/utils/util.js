import axios from 'axios'

const baseURL = '/api/admin'

const instance = axios.create({
    baseURL,
    timeout: 10000,
    // headers: {'X-Custom-Header': 'foobar'}
})

const xhr = {
    get(url, data, config) {
        return new Promise((resolve, reject) => {
            instance.get(url, {params: data}, config).then(res => {
                resolve(res.data)
            })
        })
    },
    post(url, data, config) {
        return new Promise((resolve, reject) => {
            instance.post(url, data, config).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // put(url, data, config) {
    //     return new Promise((resolve, reject) => {
    //         instance.put(url, data, config).then(res => {
    //             resolve(res.data)
    //         }).catch(err => {
    //             reject(err)
    //         })
    //     })
    // },
    fetch(url, data, config, methods) {
        return new Promise((resolve, reject) => {
            instance[methods](url, data, config).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    put(url, data, config) {
        return this.fetch(url, data, config, 'put')
    },
    delete(url, data, config) {
        return this.fetch(url, data, config, 'delete')
    }
}

export const $axios = xhr