using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblStationPc
    {
        public int? StationId { get; set; }
        public string StationName { get; set; }
        public int? LocationId { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
    }
}
