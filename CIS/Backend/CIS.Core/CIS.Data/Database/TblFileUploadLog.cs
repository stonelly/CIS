using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblFileUploadLog
    {
        public long? JournalId { get; set; }
        public string AttachmentName { get; set; }
        public string AttachmentPath { get; set; }
        public int? UserId { get; set; }
        public DateTime LogDateTime { get; set; }
        public string SystemName { get; set; }
        public string Page { get; set; }
        public string Action { get; set; }
        public string StationName { get; set; }
        public string Ipaddress { get; set; }
        public string Details { get; set; }
    }
}
