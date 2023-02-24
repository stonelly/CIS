using CIS.Data.Database;
using CIS.Data.Model;
using CIS.Data.Model.Request;
using CIS.Data.Model.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Services.Interface
{
    public interface IInventory360Service
    {
        Task<List<TblStockMaster>> StockInfo(string palletID);
        Task<List<PalletDetailDTO>> GetPalletInfo(string palletID);

        //Station

        //Location
        Task<EwnTblLocationDTO> GetInv360LocationByIPAddress(string ipAddress);

        //BinLocation
        Task<List<TblBinLocation>> GetTblBinLocationByLocationID(int locationID);

        //Employee
        Task<TblEmployee> GetEmployeeByID(string employeeID);

        Task<bool> CheckInMTS(CheckInPalletDTO request);
    }
}
