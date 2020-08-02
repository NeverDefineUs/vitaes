import { __rest } from "tslib";
/**
 * Container object living on `fieldDefinition.extensions.nexus`
 */
export class NexusFieldExtension {
    constructor(config) {
        const { resolve } = config, rest = __rest(config, ["resolve"]);
        this.config = rest;
        this.hasDefinedResolver = Boolean(resolve);
    }
}
/**
 * Container object living on `inputObjectType.extensions.nexus`
 */
export class NexusInputObjectTypeExtension {
    constructor(config) {
        const { definition } = config, rest = __rest(config, ["definition"]);
        this.config = rest;
    }
}
/**
 * Container object living on `objectType.extensions.nexus`
 */
export class NexusObjectTypeExtension {
    constructor(config) {
        const { definition } = config, rest = __rest(config, ["definition"]);
        this.config = rest;
    }
}
/**
 * Container object living on `interfaceType.extensions.nexus`
 */
export class NexusInterfaceTypeExtension {
    constructor(config) {
        const { definition } = config, rest = __rest(config, ["definition"]);
        this.config = rest;
    }
}
/**
 * Container object living on `schema.extensions.nexus`. Keeps track
 * of metadata from the builder so we can use it when we
 */
export class NexusSchemaExtension {
    constructor(config) {
        this.config = config;
    }
}
//# sourceMappingURL=extensions.js.map