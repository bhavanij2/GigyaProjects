import tracer from 'dd-trace';

tracer.init({
    enabled: true,
    logInjection: true,
    debug: !!(process.env.NODE_ENV === 'production'),
    analytics: true,
    runtimeMetrics: true,
});

export default tracer;