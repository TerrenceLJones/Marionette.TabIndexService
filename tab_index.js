Behaviors.TabIndex = Marionette.Behavior.extend({
    // FIXME Add support for multiple items per view
    defaults: function() {
        return {
            // Context of `onTab` is this.view
            onTab: function() {
                this.$el.focus();
            },
            registerOnInit: true
        };
    },

    initialize: function(options) {
        this.tabIndex_ch = Backbone.Radio.channel('tab-index');

        this.setListeners();

        this.setTabDataOnView();

        if(this.getOption('registerOnInit')) {
            this.registerElement();
        }
    },

    setListeners: function() {
        this.listenTo(this.view, 'destroy', this.unregisterElement);
    },

    setTabDataOnView: function() {
        this.view.__tabGroupName = this.getOption('tabGroupName');
        this.view.__tabIndex = this.getOption('tabIndex');
    },

    registerElement: function() {
        this.tabIndex_ch.request('register:element', this.view);
    },

    unregisterElement: function() {
        this.tabIndex_ch.request('unregister:element', this.view);
    },

    onTab: function() {
        this.getOption('onTab').apply(this.view, arguments);
    }
});
