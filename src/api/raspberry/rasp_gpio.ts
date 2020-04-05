export class GpioStatus {
    pin: PinInfo;
    value: number;
    direction: string;
}

export class PinInfo {
    _gpio: number;
    _gpioPath: string;
    _debounceTimeout: number;
    _readBuffer: any;
    _listeners: any;
    _valueFd: number;
    _risingEnabled: boolean;
    _fallingEnabled: boolean;
    _poller: any;
}
