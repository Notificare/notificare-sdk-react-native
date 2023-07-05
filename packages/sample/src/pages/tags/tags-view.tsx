import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Card from '../../components/card-view';
import { mainStyles } from '../../styles/styles';
import { Notificare } from 'react-native-notificare';
import { useSnackbarContext } from '../../contexts/snackbar';

export const TagsView = () => {
  const { addSnackbarInfoMessage } = useSnackbarContext();
  const [tags, setTags] = useState<string[]>([]);

  const fetchTags = useCallback(async () => {
    try {
      const result = await Notificare.device().fetchTags();
      setTags(result);
      console.log('=== Tags fetched successfully ===');

      addSnackbarInfoMessage({
        message: 'Tags fetched successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error fetching tags ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error fetching tags.',
        type: 'error',
      });
    }
  }, [addSnackbarInfoMessage]);

  useEffect(
    function loadInitialData() {
      (async () => {
        await fetchTags();
      })();
    },
    [fetchTags]
  );

  async function addTags() {
    try {
      await Notificare.device().addTags([
        'react-native',
        'hpinhal',
        'remove-me',
      ]);
      console.log('=== Tags added successfully ===');

      addSnackbarInfoMessage({
        message: 'Tags added successfully.',
        type: 'success',
      });

      await fetchTags();
    } catch (e) {
      console.log('=== Error adding tags ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error adding tags.',
        type: 'error',
      });
    }
  }

  async function removeTag() {
    try {
      await Notificare.device().removeTag('remove-me');
      console.log('=== Tag removed successfully ===');

      addSnackbarInfoMessage({
        message: 'Tag removed successfully.',
        type: 'success',
      });

      await fetchTags();
    } catch (e) {
      console.log('=== Error removing tags ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error removing tags.',
        type: 'error',
      });
    }
  }

  async function clearTags() {
    try {
      await Notificare.device().clearTags();
      console.log('=== Tags cleared successfully ===');

      addSnackbarInfoMessage({
        message: 'Tags cleared successfully.',
        type: 'success',
      });

      await fetchTags();
    } catch (e) {
      console.log('=== Error clearing tags ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error clearing tags.',
        type: 'error',
      });
    }
  }

  return (
    <ScrollView>
      <View style={mainStyles.main_view_container}>
        <View style={mainStyles.section_title_row}>
          <Text style={mainStyles.section_title}>Device Tags</Text>
        </View>

        <Card>
          {tags.length === 0 ? (
            <View style={mainStyles.row}>
              <Text style={mainStyles.data_field_label}>No tags found</Text>
            </View>
          ) : (
            tags.map((tag) => (
              <View key={tag} style={mainStyles.row}>
                <Text style={mainStyles.data_field_label}>{tag}</Text>
              </View>
            ))
          )}
        </Card>

        <View style={mainStyles.section_title_row} />

        <Card>
          <TouchableOpacity onPress={fetchTags}>
            <View style={mainStyles.button}>
              <Text>Fetch Tags</Text>
            </View>
          </TouchableOpacity>

          <View style={mainStyles.divider} />

          <TouchableOpacity onPress={addTags}>
            <View style={mainStyles.button}>
              <Text>Add Tags</Text>
            </View>
          </TouchableOpacity>

          <View style={mainStyles.divider} />

          <TouchableOpacity onPress={removeTag}>
            <View style={mainStyles.button}>
              <Text>Remove Tag</Text>
            </View>
          </TouchableOpacity>

          <View style={mainStyles.divider} />

          <TouchableOpacity onPress={clearTags}>
            <View style={mainStyles.button}>
              <Text>Clear Tags</Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
};
