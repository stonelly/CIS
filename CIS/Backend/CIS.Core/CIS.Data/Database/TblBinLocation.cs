using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblBinLocation
    {
        public int? BinId { get; set; }
        public int? LocationId { get; set; }
        public string BinLocationName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public int? BinDid { get; set; }
    }
}
