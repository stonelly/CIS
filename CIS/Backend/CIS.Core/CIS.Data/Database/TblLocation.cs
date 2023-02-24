using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblLocation
    {
        public int? LocationId { get; set; }
        public byte? LocationType { get; set; }
        public string LocationName { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public string StationName { get; set; }
    }
}
