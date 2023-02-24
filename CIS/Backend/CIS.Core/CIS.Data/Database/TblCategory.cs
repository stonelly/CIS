using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblCategory
    {
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int? MaxPalletCarton { get; set; }
        public bool? ReferFg { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public bool? ReferFgboxPerCarton { get; set; }
        public bool? ReferFgpackingSize { get; set; }
    }
}
