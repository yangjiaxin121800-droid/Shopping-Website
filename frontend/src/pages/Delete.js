import React from 'react';

export default function Delete() {
  return (
    <div class="DeleteCom">
      <h3>Confirm<img alt="ConfirmDelete" class="confirmClose" src="../img/close.png" /></h3>
      <div class="ConfirmDetail">
        <p>Do you really want to delete this model?</p>
        <button id="Back">Back</button>
        <button id="DeleteCom">Delete</button>
      </div>
    </div>
  );
}
