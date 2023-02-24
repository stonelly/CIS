using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblAuditLog
    {
        public string Workstation { get; set; }
        public string Module { get; set; }
        public string Type { get; set; }
        public string SerialNo { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? CreatedBy { get; set; }
    }
}
