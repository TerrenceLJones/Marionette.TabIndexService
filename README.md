# Marionette.TabIndexService
A global tabbing service for Marionette views

## Usage

Add the following bahavior to any Marionette view you'd like to be tabable. 

```javascript
  behaviors: {
    TabIndex: {
      tabGroupName: 'tabGroupName',
      tabIndex: #,
      onTab: function() {
          this.$el.focus().click();
      }
    }
  }
```
