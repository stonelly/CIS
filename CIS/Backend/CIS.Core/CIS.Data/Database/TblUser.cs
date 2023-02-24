using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblUser
    {
        public int? UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public byte? AccessLevel { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public int? StationId { get; set; }
        public int? LocationId { get; set; }
    }
}
