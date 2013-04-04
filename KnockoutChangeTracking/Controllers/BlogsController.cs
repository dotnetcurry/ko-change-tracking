using KnockoutFundamentals.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace KnockoutFundamentals.Controllers
{
    public class BlogsController : ApiController
    {
        List<Blog> BlogContext;

        public BlogsController()
        {
            if (HttpContext.Current.Application["blogContext"] == null)
            {
                HttpContext.Current.Application["blogContext"] = new List<Blog>();
                ((List<Blog>)HttpContext.Current.Application["blogContext"]).Add(
                    new Blog { Id = 1, Title = "Title 1", IsDeleted = false, Post = "Post 1" });
                ((List<Blog>)HttpContext.Current.Application["blogContext"]).Add(
                    new Blog { Id = 2, Title = "Title 2", IsDeleted = false, Post = "Post 2" });
            }
            BlogContext = (List<Blog>)(HttpContext.Current.Application["blogContext"]);
        }

        // GET api/values
        public IEnumerable<Blog> Get()
        {
            return BlogContext;
        }

        // GET api/values/5
        public Blog Get(int id)
        {
            Blog current = BlogContext.Find(b => b.Id == id && !b.IsDeleted);
            if (current == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            else
            {
                return current;
            }
        }

        // POST api/values
        public void Post([FromBody]Blog value)
        {
            value.Id = BlogContext.Count + 1;
            BlogContext.Add(value);
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]Blog value)
        {
            Blog current = BlogContext.Find(b => b.Id == id);
            if (current == null || current.IsDeleted)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            else
            {
                current.Title = value.Title;
                current.Post = value.Post;
                current.IsDeleted = value.IsDeleted;
            }
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
            Blog current = BlogContext.Find(b => b.Id == id);
            if (current == null || current.IsDeleted)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            else
            {
                current.IsDeleted = true;
            }
        }

    }
}