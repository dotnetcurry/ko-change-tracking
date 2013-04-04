/// <reference path="_references.js" />
var viewModel =
{
    blogs: ko.observableArray([]),
    selectedBlog: ko.observable(null),

    selectBlog: function (blog)
    {
        viewModel.selectedBlog(this);
        $(".right-section").show();
        $("#selectView").fadeIn("slow");
        if (!$("#editView").hidden)
        {
            $("#editView").fadeOut("slow");
        }
    },

    editBlog: function (blog)
    {
        $("#selectView").fadeOut("slow");
        $("#editView").fadeIn("slow");
    },

    updateBlog: function (blog)
    {
        viewModel.commitSelected(blog);
        $("#editView").fadeOut("slow");
    },

    cancelEdit: function (blog)
    {
        $("#editView").fadeOut("slow");
    },

    commitSelected: function (blog)
    {
        for (var property in blog)
        {
            if (blog.hasOwnProperty(property) && blog[property].commit)
                blog[property].commit();
        }
    },

    newBlog: function ()
    {
        this.blogs.push(toKoObservable({
            Title: "New " + this.blogs().length + 1,
            Id: this.blogs().length + 1,
            Post: "Post " + this.blogs().length,
            IsNew: true,
            IsDirty: false
        }));
    }
}

function toKoObservable(blog)
{
    return {
        Id: ko.protectedObservable(blog.Id),
        Title: ko.protectedObservable(blog.Title),
        Post: ko.protectedObservable(blog.Post),
        Comments: ko.protectedObservable(blog.Comments),
        IsDirty: ko.protectedObservable(blog.IsDirty),
        IsNew: ko.protectedObservable(blog.IsNew)
    };
}

$(document).ready(function ()
{
    $(".right-section").hide();
    $("#editView").hide();
    populateViewModel();
    ko.applyBindings(viewModel);

    function populateViewModel()
    {
        $.ajax(
            {
                url: "/api/Blogs",
                contentType: "text/json",
                type: "GET",
                success: function (data)
                {
                    viewModel.blogs.removeAll();
                    $.each(data, function (index)
                    {
                        viewModel.blogs.push(toKoObservable(data[index]));
                    });
                    var myTracker = new ko.changeTracker();
                    myTracker.trackChanges(viewModel);
                },
                error: function (data)
                {
                    alert("ERROR");
                }
            });
    }

    $("#saveAll").click(function ()
    {
        var saveData = ko.toJS(viewModel.blogs);
        var count = 0;
        $.each(saveData, function (index)
        {
            var current = saveData[index];
            if (current.IsDirty || current.IsNew)
            {
                count = count + 1;
                var action = "PUT";
                var stringyF = JSON.stringify(current);
                var vUrl = "/api/Blogs?Id=" + current.Id;
                if (current.IsNew)
                {
                    action = "POST";
                    vUrl = "/api/Blogs";
                }
                $.ajax(
                {
                    url: vUrl,
                    contentType: "application/json;charset=utf-8",
                    type: action,
                    data: JSON.stringify(current)
                });
            }
        });
        if (count == 0)
        {
            alert('No changes detected, nothing to save');
        }
        else
        {
            alert('Change detected in ' + count + ' items.', count);
            populateViewModel();
        }
    });
});