TabIndex.Service = App.Object.extend({
    channelName: 'tab-index',

    radioRequests: {
        'register:element': 'registerElement',
        'unregister:element': 'unregisterElement'
    },

    initialize: function() {
        this.tabGroups = {};
        this.focusTabGroup = {};

        this.setGlobalListener();
    },

    // Overwrite this fn to set up global key event listener for your project
    setGlobalListener: function() {
        this.listenTo(/*someGlobalKeyEventChannel*/, 'document:keydown', function(evt) {
            if(evt.which !== _.TAB_KEY) return;

            if(!_.keys(this.focusTabGroup).length) return;

            evt.preventDefault();

            this.handleTabEvent(evt.shiftKey);
        });
    },

    registerElement: function(view) {
        var optGroupName = view.__tabGroupName;

        if(!this.tabGroups[optGroupName]) this.tabGroups[optGroupName] = {};

        this.tabGroups[optGroupName][view.__tabIndex] = view;

        this._registerFocusListener(view);
    },

    _registerFocusListener: function(view) {
        this.listenTo(view, 'focus', function() {
            this.focusTabGroup = this.tabGroups[view.__tabGroupName];
            this.focusedIndex = view.__tabIndex;
        });
    },

    unregisterElement: function(view) {
        delete this.tabGroups[view.__tabGroupName][view.__tabIndex];
    },

    handleTabEvent: function(shiftKeyState) {
        var focusedElement = this._getFocusedElement(shiftKeyState);

        this.triggerTab(focusedElement);
    },

    _getFocusedElement: function(shiftKeyState) {
        if(shiftKeyState) {
            return this.getPreviousElement();
        }

        return this.getNextElement();
    },

    getPreviousElement: function() {
        var previousIndex = _.max(this._getIndices(this._prevFilterIterator));

        return this.focusTabGroup[previousIndex];
    },

    getNextElement: function() {
        var nextIndex = _.min(this._getIndices(this._nextFilterIterator));

        return this.focusTabGroup[nextIndex];
    },

    _getIndices: function(filterIterator) {
        var tabGroupIndices = _.keys(this.focusTabGroup);
        var filterIndices = _.filter(tabGroupIndices, filterIterator, this);

        if(!filterIndices.length) return tabGroupIndices;

        return filterIndices;
    },

    _prevFilterIterator: function(indice) {
        return indice < this.focusedIndex;
    },

    _nextFilterIterator: function(indice) {
        return indice > this.focusedIndex;
    },

    // Overwrite this fn to handle tab event
    triggerTab: function(focusedElement) {
        _.defer(_.bind(focusedElement.triggerMethod, focusedElement), 'tab');
    }
});

var tabIdex_ch = Backbone.Radio.channel('tab-index');

tabIdex_ch.once('start', function() {
    new TabIndex.Service();
});
