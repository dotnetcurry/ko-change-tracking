// Modified from original Source at http://jsfiddle.net/rniemeyer/5bxLr/

ko.changeTracker = function (viewModel)
{
    var self = this;
    self.changes = ko.observableArray();

    //add this change to the array of changes
    function onPropertyChanged(property, source)
    {
        if (source.IsDirty)
        {
            source.IsDirty(true);
        }
        //self.changes.push({ property: property, value: ko.toJS(source[property]), source: source });
    }

    //track a single change
    function trackChange(prop, source)
    {
        var value = source[prop];
        if (ko.isObservable(value))
        {
            value.subscribe(function ()
            {
                onPropertyChanged(prop, source);
            });
        }
    }

    //expose a function to track changes for each property on an object
    self.trackChanges = function (model)
    {
        for (var prop in model)
        {
            if (model.hasOwnProperty(prop))
            {
                trackChange(prop, model);

                var underlying = ko.utils.unwrapObservable(model[prop]);
                if (underlying instanceof Array)
                {
                    ko.utils.arrayForEach(underlying, function (item)
                    {
                        self.trackChanges(item);
                    })
                }
                else if (typeof underlying === "object")
                {
                    self.trackChanges(underlying);
                }
            }
        }
    }
}