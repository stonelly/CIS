using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblStockTransactionBak
    {
        public int? Stid { get; set; }
        public byte? TransactionType { get; set; }
        public int? LocationId { get; set; }
        public int? BinId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public int? StockId { get; set; }
        public int? UserId { get; set; }
        public string StationName { get; set; }
        public int? EmployeeId { get; set; }
        public int? StockDid { get; set; }
        public int? CartonId { get; set; }
        public decimal? CartonCapacity { get; set; }
    }
}
