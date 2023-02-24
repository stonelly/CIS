using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblEmployee
    {
        public string EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public DateTime? SyncDate { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
    }
}
