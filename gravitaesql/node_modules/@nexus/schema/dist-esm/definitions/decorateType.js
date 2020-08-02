export function decorateType(type, config) {
    type.extensions = Object.assign(Object.assign({}, type.extensions), { nexus: {
            asNexusMethod: config.asNexusMethod,
            rootTyping: config.rootTyping,
        } });
    return type;
}
//# sourceMappingURL=decorateType.js.map