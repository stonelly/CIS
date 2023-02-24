using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblUserLog
    {
        public int? UlogId { get; set; }
        public string UlogGuid { get; set; }
        public int? UserId { get; set; }
        public DateTime? LogDate { get; set; }
        public string Ip { get; set; }
        public string StationName { get; set; }
        public byte? Status { get; set; }
    }
}
