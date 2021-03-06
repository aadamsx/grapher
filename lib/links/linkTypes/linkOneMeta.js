import Link from './base.js';
import SmartArgs from './lib/smartArguments.js';

export default class LinkOneMeta extends Link {
    applyFindFilters(filters) {
        let value = this.object[this.getLinkStorageField()];

        filters._id = value ? value._id : value;
    }

    applyFindFiltersForVirtual(filters) {
        filters[this.getLinkStorageField() + '._id'] = this.object._id;
    }

    set(what, metadata = {}) {
        if (this.isVirtual) {
            this._virtualAction('set', what);
            return this;
        }

        let field = this.getLinkStorageField();
        metadata._id = this.identifyId(what, true);

        this.object[field] = metadata;

        this.linker.mainCollection.update(this.object._id, {
            $set: {
                [field]: metadata
            }
        });

        return this;
    }

    metadata(extendMetadata) {
        if (this.isVirtual) {
            this._virtualAction('metadata', undefined, extendMetadata);

            return this;
        }

        let field = this.getLinkStorageField();

        if (!extendMetadata) {
            return this.object[field];
        } else {
            _.extend(this.object[field], extendMetadata);

            this.linker.mainCollection.update(this.object._id, {
                $set: {
                    [field]: this.object[field]
                }
            });
        }

        return this;
    }

    unset() {
        if (this.isVirtual) {
            this._virtualAction('unset');
            return this;
        }

        let field = this.getLinkStorageField();
        this.object[field] = {};

        this.linker.mainCollection.update(this.object._id, {
            $set: {
                [field]: {}
            }
        });

        return this;
    }

    add(what, metadata) {
        if (this.isVirtual) {
            this._virtualAction('add', what, metadata);
            return this;
        }

        throw new Meteor.Error('invalid-command', 'You are trying to *add* in a relationship that is single. Please use set/unset for *single* relationships');
    }

    remove(what) {
        if (this.isVirtual) {
            this._virtualAction('remove', what);
            return this;
        }

        throw new Meteor.Error('invalid-command', 'You are trying to *remove* in a relationship that is single. Please use set/unset for *single* relationships');
    }
}