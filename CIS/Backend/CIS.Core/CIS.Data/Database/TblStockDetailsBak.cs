﻿using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblStockDetailsBak
    {
        public int? StockDid { get; set; }
        public string BatchLotNo { get; set; }
        public string BatchSerialNo { get; set; }
        public int? Capacity { get; set; }
        public int? CartonQty { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public int? UserId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? StockId { get; set; }
        public DateTime? BatchMfgDate { get; set; }
        public int? InnerBoxPerCarton { get; set; }
        public int? TotalInnerBox { get; set; }
        public int? InnerBoxPackingSize { get; set; }
    }
}
