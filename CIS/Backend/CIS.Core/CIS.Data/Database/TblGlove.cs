using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblGlove
    {
        public string GloveId { get; set; }
        public string GloveCode { get; set; }
        public byte? Status { get; set; }
    }
}
