using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblBinLocationDetail
    {
        public int? BinDid { get; set; }
        public int? StockId { get; set; }
        public int? BinId { get; set; }
        public byte? Type { get; set; }
        public DateTime? InDate { get; set; }
        public DateTime? OutDate { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public int? LocationIdin { get; set; }
        public int? UserId { get; set; }
        public string StationName { get; set; }
        public int? EmployeeId { get; set; }
        public int? LocationIdout { get; set; }
        public int? UserId2 { get; set; }
        public string StationName2 { get; set; }
        public int? EmployeeId2 { get; set; }
    }
}
