
using CIS.Data.Database;
using CIS.Data.Model;
using CIS.Data.Model.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Services.Interface
{
    public interface IEwareNaviService
    {
        //Task<COM_LOGINUSER> GetCOM_LOGINUSER();
        Task<AuthDataReponse> Authenticate(string username, string password, EwnTblLocationDTO location);
        Task<List<DNSTOCKDTO>> GetDNStockByPalletID(string palletID);
        DateTime GetPlanDay(string palletID);
        String GetCustPONumber(string palletID);

        #region
        Task<bool> CheckStockWarehouseCodeAreaNo(string warehouse_code, string area_no, string palletNo);
        Task<bool> HasSOItemReserved(List<EWN_CompletedPalletDTO> eWN_CompletedPalletDTOLst);
        Task<string> HasReservedEmptyLocation(List<EWN_CompletedPalletDTO> eWN_CompletedPalletDTOLst);
        Task<string> GetReservedWarehouse(List<EWN_CompletedPalletDTO> eWN_CompletedPalletDTOLst);
        Task<bool> isProductionOutputCheckedOut(string palletNo);
        #endregion

        #region CheckIn
        Task<bool> IsStockInserted(string inPalletNo, string inAreaNo);
        Task<bool> UpdateCheckInStock(string inPalletNo, string inWarehouseCode, string inAreaNo);

        bool InsertStock(string inPalletNo, string inWarehouseCode, string inCustPONo, string inItemCode, string inQAFlag, string inLotNo, string inSONo, string inQty, string userId, string userName);
        #endregion
    }
}
