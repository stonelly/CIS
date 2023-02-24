using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblErrorLog
    {
        public DateTime LogDateTime { get; set; }
        public string SystemName { get; set; }
        public string Page { get; set; }
        public string ErrorMsg { get; set; }
        public int UserId { get; set; }
        public string StationName { get; set; }
        public string Ipaddress { get; set; }
    }
}
