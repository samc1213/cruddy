/*function validate()
{
   if( document.myForm.field1.value == "" )
   {
      alert( "Please provide your Email!" );
      document.myForm.field1.focus() ;
      return false;
   }
   
   if( document.myForm.field2.value == "" ||
   isNaN( document.myForm.field2.value ) ||
   document.myForm.field2.value.length != 5 )
   {
      alert( "Please provide a zip in the format #####." );
      document.myForm.field2.focus() ;
      return false;
   }
   
   
   return( true );
}