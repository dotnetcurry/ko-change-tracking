using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KnockoutFundamentals.Models
{
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Post { get; set; }
        public string Comments { get; set; }
        public bool IsDeleted { get; set; }
    }
}