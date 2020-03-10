export class status {
    pin: pinInfo
    value: number
    direction: string
}

export class pinInfo {
    _gpio: number
    _gpioPath: string
    _debounceTimeout: number
    _readBuffer: any
    _listeners: any
    _valueFd: number
    _risingEnabled: boolean
    _fallingEnabled: boolean
    _poller: any
}