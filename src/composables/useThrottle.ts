export const useThrottle = () => {
    let timer: ReturnType<typeof setTimeout>;

    const throttle = (cb: () => void, delay: number) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            cb();
        }, delay);
    };

    return { throttle };
};
