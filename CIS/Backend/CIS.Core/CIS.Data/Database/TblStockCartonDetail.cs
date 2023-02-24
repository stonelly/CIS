using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblStockCartonDetail
    {
        public int StockCid { get; set; }
        public string CartonId { get; set; }
        public int CartonNo { get; set; }
        public int StockDid { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public int StockId { get; set; }
        public int? Capacity { get; set; }
        public string ActualSo { get; set; }
        public string ActualWo { get; set; }
        public int? ActualSocartonNo { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public bool? IsSterile { get; set; }
        public DateTime? SterileDate { get; set; }
        public int? LocationId { get; set; }
    }
}
