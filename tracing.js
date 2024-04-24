const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { trace } = require("@opentelemetry/api");
//Instrumentations
const { ExpressInstrumentation } = require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

//const { Resource } = require('@opentelemetry/resources');
//const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
//const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
//const { trace } = require('@opentelemetry/api');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

module.exports = (serviceName) => {
    const exporter = new JaegerExporter({
        serviceName: serviceName,
        host: 'localhost',
        port: 14250, // OTLP gRPC port
        // Adjust this value as needed based on your Jaeger configuration
        // For example, if you're using the all-in-one Docker container, it might be 14250
    });

    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
    });
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register();

    return trace.getTracer(serviceName);
};