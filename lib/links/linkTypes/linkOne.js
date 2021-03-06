import Link from './base.js';
import SmartArgs from './lib/smartArguments.js';

export default class LinkOne extends Link {
    applyFindFilters(filters) {
        filters._id = this.object[this.getLinkStorageField()];
    }

    applyFindFiltersForVirtual(filters) {
        filters[this.getLinkStorageField()] = this.object._id;
    }

    set(what) {
        if (this.isVirtual) {
            this._virtualAction('set', what);
            return this;
        }

        let field = this.getLinkStorageField();
        const _id = this.identifyId(what, true);

        this.object[field] = _id;

        this.linker.mainCollection.update(this.object._id, {
            $set: {
                [field]: _id
            }
        });

        return this;
    }

    unset() {
        if (this.isVirtual) {
            this._virtualAction('unset', what);
            return this;
        }

        let field = this.getLinkStorageField();
        this.object[field] = null;

        this.linker.mainCollection.update(this.object._id, {
            $set: {
                [field]: null
            }
        });

        return this;
    }

    add(what) {
        if (this.isVirtual) {
            this._virtualAction('add', what);
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