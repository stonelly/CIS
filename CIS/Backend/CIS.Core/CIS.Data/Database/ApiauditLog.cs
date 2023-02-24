using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class ApiauditLog
    {
        public long ApiauditLogId { get; set; }
        public string Apioperation { get; set; }
        public string Apifunction { get; set; }
        public string PayLoad { get; set; }
        public string ReturnLoad { get; set; }
        public string UserId { get; set; }
        public string UserToken { get; set; }
        public DateTime CreatedDateTime { get; set; }
    }
}
