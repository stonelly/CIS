using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblReason
    {
        public int? ReasonId { get; set; }
        public string ReasonCode { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
    }
}
