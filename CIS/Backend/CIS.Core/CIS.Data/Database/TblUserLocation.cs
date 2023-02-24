using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblUserLocation
    {
        public int? Id { get; set; }
        public int? UserId { get; set; }
        public int? LocationId { get; set; }
        public bool? Del { get; set; }
    }
}
