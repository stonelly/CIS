using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblStockCartonDetailsBak
    {
        public int CartonId { get; set; }
        public int CartonNo { get; set; }
        public int StockDid { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public int? StockId { get; set; }
        public int? Capacity { get; set; }
    }
}
